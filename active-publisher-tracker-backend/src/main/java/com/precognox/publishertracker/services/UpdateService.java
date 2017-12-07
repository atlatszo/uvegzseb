package com.precognox.publishertracker.services;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Expr;
import com.avaje.ebean.Junction;
import com.precognox.publishertracker.beans.IdAndValue;
import com.precognox.publishertracker.beans.ListUpdatesResult;
import com.precognox.publishertracker.beans.UpdateDetailsRB;
import com.precognox.publishertracker.beans.UpdateRB;
import com.precognox.publishertracker.entities.Category;
import com.precognox.publishertracker.entities.Document;
import com.precognox.publishertracker.entities.Update;
import com.precognox.publishertracker.util.DateFormatter;
import org.apache.commons.collections.ComparatorUtils;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 *
 * @author precognox
 */
public class UpdateService {
    
    public List<IdAndValue> listCategories() {
        return Ebean.find(Category.class).findList()
            .stream()
            .map(this::mapCategoriesToIdAndValueRB)
            .collect(Collectors.toList());
    }
    
    private IdAndValue mapCategoriesToIdAndValueRB(Category category) {
        return new IdAndValue(category.getId(), category.getName());
    }
    
    public ListUpdatesResult listUpdates(int start, int rows, String dataOwnerNameFragment, List<Integer> categoryIdList) {
        Junction<Update> query = Ebean.find(Update.class)
            .where()
            .conjunction();
        
        if (dataOwnerNameFragment != null) {
            query.add(Expr.or(Expr.icontains("dataOwner.shortName", dataOwnerNameFragment), Expr.icontains("dataOwner.longName", dataOwnerNameFragment)));
        }
        
        if (!categoryIdList.isEmpty()) {
            query.add(Expr.in("category.id", categoryIdList));
        }
        
        int totalCount = query.findCount();
        
        List<Update> updates = query.setFirstRow(start).setMaxRows(rows).orderBy("date DESC").findList();

        return new ListUpdatesResult(totalCount, mergeUpdates(updates));
    }

    private List<UpdateRB> mergeUpdates(List<Update> updates) {
        Function<Update, List<Object>> classifier =
                update -> Arrays.asList(update.getDate().truncatedTo(ChronoUnit.DAYS), update.getDataOwner().getLongName(), update.getCategory());

        Map<List<Object>, List<Update>> groupedUpdates = updates.stream().collect(Collectors.groupingBy(classifier));

        List<UpdateRB> results = new ArrayList<>();

        for (List<Update> updateGroup : groupedUpdates.values()) {
            UpdateRB rb = new UpdateRB();
            rb.setDataOwnerName(updateGroup.get(0).getDataOwner().getLongName());
            rb.setUpdateDate(DateFormatter.formatDate(updateGroup.get(0).getDate()));
            Optional.ofNullable(updateGroup.get(0).getCategory()).ifPresent(
                    category -> rb.setCategoryName(category.getName())
            );

            List<UpdateDetailsRB> documentRbList = updateGroup.stream()
                    .map(Update::getDocuments)
                    .flatMap(Collection::stream)
                    .map(this::mapDocumentToRb)
                    .collect(Collectors.toList());

            rb.setDetails(documentRbList);

            results.add(rb);
        }

        Comparator[] comparators = {
                Comparator.comparing(UpdateRB::getUpdateDate).reversed(),
                Comparator.comparing(UpdateRB::getDataOwnerName)
        };

        results.sort(ComparatorUtils.chainedComparator(comparators));

        return results;
    }

    private UpdateDetailsRB mapDocumentToRb(Document dataItem) {
        UpdateDetailsRB detailsRB = new UpdateDetailsRB();
        detailsRB.setDocumentTitle(dataItem.getTitle());
        detailsRB.setPageUrl(dataItem.getPageUrl());

        Optional.ofNullable(dataItem.getProvidedDate()).ifPresent(
                date -> detailsRB.setProvidedDate(DateFormatter.formatDate(dataItem.getProvidedDate()))
        );

        return detailsRB;
    }
    
}
