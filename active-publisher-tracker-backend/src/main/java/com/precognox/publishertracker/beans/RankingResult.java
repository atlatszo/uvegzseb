package com.precognox.publishertracker.beans;

import com.precognox.publishertracker.ranking.RankingEntry;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RankingResult {

    private int totalCount;
    private List<RankingEntry> ranking;

}
